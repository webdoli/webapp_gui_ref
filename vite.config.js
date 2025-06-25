// vite.config.js
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  resolve: {
    // three 패키지를 단일 모듈로 강제
    dedupe: ['three'],
    alias: {
      // 모든 import 'three'가 node_modules/three을 가리키도록
      three: path.resolve(__dirname, 'node_modules/three')
    }
  }
});
