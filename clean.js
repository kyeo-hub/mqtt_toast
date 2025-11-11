const fs = require('fs');
const path = require('path');

// 需要删除的文件和目录列表
const cleanupPaths = [
  'src-tauri-backup',
  'test_notifier.js',
  'mqtt_toast.js',
  'app-icon.png',
  'ICON_GENERATION.md'
];

console.log('清理项目中不必要的文件以减小最终构建体积...\n');

let cleanedCount = 0;

for (const item of cleanupPaths) {
  const fullPath = path.join(__dirname, item);
  
  try {
    if (fs.existsSync(fullPath)) {
      if (fs.lstatSync(fullPath).isDirectory()) {
        fs.rmSync(fullPath, { recursive: true, force: true });
        console.log(`✓ 已删除目录: ${item}`);
      } else {
        fs.unlinkSync(fullPath);
        console.log(`✓ 已删除文件: ${item}`);
      }
      cleanedCount++;
    } else {
      console.log(`- 不存在: ${item}`);
    }
  } catch (error) {
    console.log(`✗ 删除失败: ${item} (${error.message})`);
  }
}

console.log(`\n清理完成! 共删除了 ${cleanedCount} 个文件/目录。`);

console.log('\n提示:');
console.log('1. 如需重新构建，请运行: pnpm run tauri:build');
console.log('2. 如需清理Rust构建缓存，请运行: cd src-tauri && cargo clean');