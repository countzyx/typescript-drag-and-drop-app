// Autobind is a decorator to assign the proper "this" to class methods that are event handlers, etc.
export function Autobind() {
  return function (_0: unknown, _1: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const adjDescriptor: PropertyDescriptor = {
      configurable: true,
      get() {
        return originalMethod.bind(this);
      },
    };
    return adjDescriptor;
  };
}
