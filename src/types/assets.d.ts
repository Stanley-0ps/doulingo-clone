/**
 * Ambient types for static asset imports (Metro).
 *
 * Without these, TypeScript cannot resolve `import image from "@/assets/...png"`.
 * With them, an image import resolves to the numeric asset id Metro returns,
 * which is the accepted type for `<Image source={...}>`.
 */

declare module "*.png" {
  const src: number;
  export default src;
}

declare module "*.jpg" {
  const src: number;
  export default src;
}

declare module "*.ttf" {
  const src: number;
  export default src;
}

/**
 * NativeWind's Metro transformer compiles `global.css` at build time and
 * injects the result into the bundle, so the file is imported purely for its
 * side effects and exposes no runtime exports. Neither `nativewind/types` nor
 * `react-native-css/types` declares the `*.css` module, so it is declared here.
 */
declare module "*.css";
