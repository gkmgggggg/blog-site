import type { Post, Author } from '@/types'

export const defaultAuthor: Author = {
  id: '1',
  name: '张明',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=blog-author',
  bio: '全栈开发工程师，热爱技术写作与开源分享。',
}

export const initialPosts: Post[] = [
  {
    id: '1',
    title: 'React 19 新特性全面解析',
    slug: 'react-19-new-features',
    excerpt:
      'React 19 带来了许多令人兴奋的新特性，包括 Actions、新的 Hooks、以及对 Web Components 的原生支持。本文将深入探讨这些新特性。',
    content: `<h2>React 19 正式发布</h2><p>React 19 是一个重大版本更新，带来了许多开发者期待已久的功能。</p><h3>Actions</h3><p>Actions 是 React 19 中最重要的新特性之一。它简化了异步状态管理，让表单提交和数据突变变得更加简单。</p><pre><code>// 使用 Actions
async function updateName(formData) {
  'use server';
  await updateUser({ name: formData.get('name') });
}</code></pre><h3>新的 Hooks</h3><p>React 19 引入了几个新的 Hooks：</p><ul><li><strong>useActionState</strong>：管理 Action 的状态</li><li><strong>useFormStatus</strong>：获取表单提交状态</li><li><strong>useOptimistic</strong>：乐观更新 UI</li></ul><h3>结语</h3><p>React 19 的发布标志着 React 生态系统的一个重要里程碑，这些新特性将大大提升开发体验。</p>`,
    coverImage:
      'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop',
    author: defaultAuthor,
    tags: ['React', 'JavaScript', '前端'],
    category: '前端开发',
    status: 'published',
    createdAt: '2024-12-01T08:00:00Z',
    updatedAt: '2024-12-01T10:00:00Z',
    publishedAt: '2024-12-01T10:00:00Z',
    readingTime: 8,
    views: 1240,
  },
  {
    id: '2',
    title: 'TypeScript 5.x 类型体操实战指南',
    slug: 'typescript-5-type-gymnastics',
    excerpt:
      '深入理解 TypeScript 高级类型，通过实战案例掌握条件类型、映射类型、模板字面量类型等高级特性。',
    content: `<h2>TypeScript 高级类型</h2><p>TypeScript 的类型系统非常强大，掌握高级类型可以让你写出更安全、更优雅的代码。</p><h3>条件类型</h3><p>条件类型允许你根据类型条件选择不同的类型：</p><pre><code>type IsString&lt;T&gt; = T extends string ? true : false;
type A = IsString&lt;string&gt;; // true
type B = IsString&lt;number&gt;; // false</code></pre><h3>映射类型</h3><p>映射类型可以基于现有类型创建新类型：</p><pre><code>type Readonly&lt;T&gt; = {
  readonly [P in keyof T]: T[P];
};</code></pre><h3>模板字面量类型</h3><p>TypeScript 4.1 引入的模板字面量类型让字符串类型操作更加灵活。</p>`,
    coverImage:
      'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&auto=format&fit=crop',
    author: defaultAuthor,
    tags: ['TypeScript', '类型系统', '前端'],
    category: '前端开发',
    status: 'published',
    createdAt: '2024-11-20T08:00:00Z',
    updatedAt: '2024-11-20T12:00:00Z',
    publishedAt: '2024-11-20T12:00:00Z',
    readingTime: 12,
    views: 890,
  },
  {
    id: '3',
    title: 'Tailwind CSS v4 重大变化与迁移指南',
    slug: 'tailwindcss-v4-migration-guide',
    excerpt:
      'Tailwind CSS v4 采用全新架构，基于 CSS 原生变量和 @layer 规则，性能大幅提升。了解如何从 v3 迁移到 v4。',
    content: `<h2>Tailwind CSS v4 新架构</h2><p>Tailwind CSS v4 是一次革命性的重写，带来了更快的构建速度和更小的包体积。</p><h3>主要变化</h3><ul><li>使用 CSS 原生变量替代 JavaScript 配置</li><li>新的 @theme 指令用于定义主题</li><li>Vite 插件替代 PostCSS</li><li>自动内容检测</li></ul><h3>迁移步骤</h3><p>从 v3 迁移到 v4 需要注意以下几点变化：</p><blockquote>重要：v4 不再需要 tailwind.config.js 文件，所有配置都在 CSS 文件中完成。</blockquote>`,
    coverImage:
      'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=800&auto=format&fit=crop',
    author: defaultAuthor,
    tags: ['CSS', 'Tailwind', '前端'],
    category: '前端开发',
    status: 'published',
    createdAt: '2024-11-10T08:00:00Z',
    updatedAt: '2024-11-10T14:00:00Z',
    publishedAt: '2024-11-10T14:00:00Z',
    readingTime: 10,
    views: 654,
  },
  {
    id: '4',
    title: 'Node.js 性能优化实践',
    slug: 'nodejs-performance-optimization',
    excerpt:
      '通过实际案例分析 Node.js 应用的性能瓶颈，并提供针对性的优化策略，包括内存管理、异步优化和集群部署。',
    content: `<h2>Node.js 性能优化</h2><p>Node.js 应用的性能优化是一个复杂的话题，需要从多个维度进行分析和优化。</p><h3>内存管理</h3><p>V8 引擎的垃圾回收机制对应用性能有重要影响，了解如何减少内存泄漏至关重要。</p><h3>异步优化</h3><p>合理使用 Promise.all、流式处理等技术可以显著提升 I/O 密集型应用的性能。</p>`,
    coverImage:
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop',
    author: defaultAuthor,
    tags: ['Node.js', '性能优化', '后端'],
    category: '后端开发',
    status: 'published',
    createdAt: '2024-10-25T08:00:00Z',
    updatedAt: '2024-10-25T16:00:00Z',
    publishedAt: '2024-10-25T16:00:00Z',
    readingTime: 15,
    views: 432,
  },
  {
    id: '5',
    title: '2025 年前端技术趋势展望（草稿）',
    slug: '2025-frontend-trends',
    excerpt: '探讨 2025 年前端开发领域的重要趋势，包括 AI 辅助编程、边缘计算、WebAssembly 等。',
    content: `<h2>2025 前端展望</h2><p>前端技术日新月异，2025 年将会有哪些重要趋势值得关注？</p><h3>AI 辅助开发</h3><p>AI 代码助手将进一步融入开发工作流，显著提升开发效率。</p>`,
    coverImage:
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop',
    author: defaultAuthor,
    tags: ['趋势', '前端', '2025'],
    category: '技术趋势',
    status: 'draft',
    createdAt: '2024-12-10T08:00:00Z',
    updatedAt: '2024-12-10T09:00:00Z',
    readingTime: 6,
    views: 0,
  },
]

export const categories = ['前端开发', '后端开发', '技术趋势', '工具效率', '架构设计', '开源项目']
