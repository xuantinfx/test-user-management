import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import ErrorAlert from '@/components/ui/ErrorAlert.vue';

describe('ErrorAlert.vue', () => {
  it('does not render when message is empty', () => {
    const wrapper = mount(ErrorAlert, {
      props: {
        message: ''
      }
    });
    
    // Component should not be visible when message is empty
    expect(wrapper.isVisible()).toBe(false);
  });

  it('renders with error message', () => {
    const errorMessage = 'This is an error message';
    const wrapper = mount(ErrorAlert, {
      props: {
        message: errorMessage
      }
    });
    
    // Check if component renders
    expect(wrapper.isVisible()).toBe(true);
    
    // Check if error message is displayed
    expect(wrapper.text()).toContain(errorMessage);
    
    // Check if error class is applied by default
    expect(wrapper.classes()).toContain('error');
  });

  it('applies correct class based on type prop', async () => {
    const wrapper = mount(ErrorAlert, {
      props: {
        message: 'Alert message',
        type: 'warning'
      }
    });
    
    // Check if warning class is applied
    expect(wrapper.classes()).toContain('warning');
    
    // Change type to info
    await wrapper.setProps({ type: 'info' });
    
    // Check if info class is applied
    expect(wrapper.classes()).toContain('info');
  });

  it('emits dismiss event when dismiss button is clicked', async () => {
    const wrapper = mount(ErrorAlert, {
      props: {
        message: 'Dismissible alert',
        dismissible: true
      }
    });
    
    // Check if dismiss button exists
    expect(wrapper.find('.dismiss-btn').exists()).toBe(true);
    
    // Click dismiss button
    await wrapper.find('.dismiss-btn').trigger('click');
    
    // Check if dismiss event was emitted
    expect(wrapper.emitted()).toHaveProperty('dismiss');
    expect(wrapper.emitted('dismiss')).toHaveLength(1);
  });

  it('does not show dismiss button when dismissible is false', () => {
    const wrapper = mount(ErrorAlert, {
      props: {
        message: 'Non-dismissible alert',
        dismissible: false
      }
    });
    
    // Check if dismiss button does not exist
    expect(wrapper.find('.dismiss-btn').exists()).toBe(false);
  });
});
