import '@testing-library/jest-dom';

// Mock window.scrollTo to prevent warnings in tests
global.scrollTo = () => {};
