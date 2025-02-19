import React from 'react';
import { GeistProvider, Tabs } from '@geist-ui/core';
import PropTypes from 'prop-types';

export default function Tabination({ tabs, initialValue="1", hideDivider, position = 'fixed', hoverWidth = 1, onChange }) {
  return (
    <GeistProvider>
      <div className='tabs'>
        <Tabs 
          initialValue={initialValue} 
          hideDivider={hideDivider} 
          hoverWidthRatio={hoverWidth} 
          style={{position: {position}, width: '-webkit-fill-available'}}
          onChange={onChange}
        >
          {tabs.map(({ label, value, Content }) => (
            <Tabs.Item key={value} label={label} value={value}>
              {/* Content will be rendered by Outlet */}
              {Content && <Content />}
            </Tabs.Item>
          ))}
        </Tabs>
      </div>
    </GeistProvider>
  );
}
Tabination.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
      Content: PropTypes.elementType,
    })
  ).isRequired,
  initialValue: PropTypes.string,
};
