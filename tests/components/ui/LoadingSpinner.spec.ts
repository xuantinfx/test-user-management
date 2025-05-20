import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue';

describe('LoadingSpinner.vue', () => {
  it('renders with default props', () => {
    const wrapper = mount(LoadingSpinner);
    
    // Check if component renders
    expect(wrapper.exists()).toBe(true);
    
    // Check if default message is displayed
    expect(wrapper.text()).toContain('Loading...');
    
    // Check if spinner element exists
    expect(wrapper.find('.spinner').exists()).toBe(true);
    
    // Check if overlay class is not applied by default
    expect(wrapper.classes()).not.toContain('overlay');
  });

  it('renders with custom message', () => {
    const customMessage = 'Custom loading message';
    const wrapper = mount(LoadingSpinner, {
      props: {
        message: customMessage
      }
    });
    
    // Check if custom message is displayed
    expect(wrapper.text()).toContain(customMessage);
  });

  it('applies overlay class when overlay prop is true', () => {
    const wrapper = mount(LoadingSpinner, {
      props: {
        overlay: true
      }
    });
    
    // Check if overlay class is applied
    expect(wrapper.classes()).toContain('overlay');
  });

  it('does not display message when message prop is empty', () => {
    const wrapper = mount(LoadingSpinner, {
      props: {
        message: ''
      }
    });
    
    // Check if message element is not rendered
    expect(wrapper.find('.message').exists()).toBe(false);
  });
});
