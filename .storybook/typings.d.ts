/// <reference types="@testing-library/jest-dom" />

declare module '*.md' {
  const content: string;
  export default content;
}
