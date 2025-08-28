import React, { useEffect, useRef } from 'react';
import cytoscape from 'cytoscape';

const GraphViewer = ({ data }) => {
  const containerRef = useRef(null);
  const cyRef = useRef(null);

  useEffect(() => {
    if (!data || Object.keys(data).length === 0) return;
    if (!containerRef.current) return;

    const elements = [];
    const incomingCount = {};
    const nodeIds = new Set();

    Object.entries(data).forEach(([file, imports]) => {
      const normalizedImports = Array.isArray(imports)
        ? imports
        : imports
        ? [imports]
        : [];
      if (!incomingCount[file]) incomingCount[file] = 0;

      normalizedImports.forEach((dep) => {
        if (!incomingCount[dep]) incomingCount[dep] = 0;
        incomingCount[dep]++;
      });
    });

    Object.entries(data).forEach(([file, imports]) => {
      const normalizedImports = Array.isArray(imports)
        ? imports
        : imports
        ? [imports]
        : [];
      const isUnused = incomingCount[file] === 0;

      const fileName = file.split('\\').pop();
      const nameWithoutExt = fileName.replace(/\.[^/.]+$/, '');
      const firstLetter = isUnused
        ? fileName.charAt(0)
        : nameWithoutExt.charAt(0);
      const displayLabel = isUnused
        ? firstLetter + fileName.match(/\.[^/.]+$/)[0]
        : firstLetter;

      if (!nodeIds.has(file)) {
        elements.push({
          data: {
            id: file,
            label: displayLabel,
            fullPath: file,
            fullName: fileName,
          },
          classes: isUnused ? 'unused' : '',
        });
        nodeIds.add(file);
      }

      normalizedImports.forEach((dep) => {
        let targetId = dep;
        let classes = '';
        let depName = dep.split('\\').pop() || dep;
        const depNameNoExt = depName.replace(/\.[^/.]+$/, '');
        const depFirstLetter = depNameNoExt.charAt(0);

        if (!dep.startsWith('C:\\')) {
          targetId = `ext:${dep}`;
          classes = 'external';
        }

        if (!nodeIds.has(targetId)) {
          elements.push({
            data: {
              id: targetId,
              label: depFirstLetter,
              fullPath: dep,
              fullName: depName,
            },
            classes,
          });
          nodeIds.add(targetId);
        }

        elements.push({
          data: { id: `${file}->${targetId}`, source: file, target: targetId },
        });
      });
    });

    const cy = cytoscape({
      container: containerRef.current,
      elements,
      style: [
        {
          selector: 'node',
          style: {
            label: 'data(label)',
            'background-color': '#3b82f6',
            color: '#fff',
            'text-valign': 'center',
            'text-halign': 'center',
            'font-size': 12,
            'border-width': 2,
            'border-color': '#1e40af',
          },
        },
        {
          selector: 'node.unused',
          style: {
            'background-color': '#ef4444',
            'border-color': '#991b1b',
          },
        },
        {
          selector: 'node.external',
          style: {
            'background-color': '#facc15',
            'border-color': '#ca8a04',
            color: '#000',
          },
        },
        {
          selector: 'edge',
          style: {
            width: 2,
            'line-color': '#ccc',
            'target-arrow-color': '#ccc',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
          },
        },
        {
          selector: 'node.highlighted',
          style: {
            'background-color': '#10b981',
            'border-width': 3,
            'border-color': '#065f46',
          },
        },
      ],
      layout: { name: 'cose', animate: true, padding: 50 },
      userZoomingEnabled: false,
      userPanningEnabled: false,
      boxSelectionEnabled: false,
    });

    cyRef.current = cy;

    cy.nodes().forEach((node) => node.grabbable(false));

    cy.ready(() => {
      if (cy && !cy.destroyed()) {
        cy.fit();
      }
    });

    const handleResize = () => {
      if (cy && !cy.destroyed()) {
        cy.resize();
        cy.layout({ name: 'cose', animate: true, padding: 50 }).run();
      }
    };
    window.addEventListener('resize', handleResize);

    const tooltip = document.createElement('div');
    tooltip.style.position = 'fixed';
    tooltip.style.background = '#333';
    tooltip.style.color = '#fff';
    tooltip.style.padding = '6px 10px';
    tooltip.style.borderRadius = '4px';
    tooltip.style.fontSize = '14px';
    tooltip.style.pointerEvents = 'none';
    tooltip.style.whiteSpace = 'pre-line';
    tooltip.style.display = 'none';
    document.body.appendChild(tooltip);

    const showTooltip = (evt) => {
      if (!cy || cy.destroyed()) return;
      const node = evt.target;
      const id = node.id();
      const count = incomingCount[id] || 0;

      let text = `${node.data('fullName')}\n`;
      if (node.hasClass('unused')) {
        text += `Depends on ${node.outgoers('node').length} files`;
      } else if (!id.startsWith('ext:')) {
        text += `Used by ${count} files`;
      } else {
        text += `External dependency`;
      }

      tooltip.innerText = text;
      tooltip.style.display = 'block';
    };

    const hideTooltip = () => {
      tooltip.style.display = 'none';
    };

    const moveTooltip = (evt) => {
      tooltip.style.left = evt.originalEvent.clientX + 10 + 'px';
      tooltip.style.top = evt.originalEvent.clientY + 10 + 'px';
    };

    cy.on('mouseover', 'node', showTooltip);
    cy.on('mouseout', 'node', hideTooltip);
    cy.on('mousemove', 'node', moveTooltip);

    return () => {
      if (cy && !cy.destroyed()) {
        cy.removeListener('mouseover', 'node', showTooltip);
        cy.removeListener('mouseout', 'node', hideTooltip);
        cy.removeListener('mousemove', 'node', moveTooltip);
        cy.destroy();
      }
      tooltip.remove();
      window.removeEventListener('resize', handleResize);
      cyRef.current = null;
    };
  }, [data]);

  return <div ref={containerRef} style={{ width: '100%', height: '70vh' }} />;
};

export default GraphViewer;
