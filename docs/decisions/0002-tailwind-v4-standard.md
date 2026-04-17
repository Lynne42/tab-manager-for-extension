# 2. Tailwind CSS v4 与 Vanilla 混合使用规范

Date: 2024-03-23
Status: Accepted

## Context
新版项目中使用了 Tailwind CSS v4 与 PostCSS。

## Decision
坚持实用主义并与 Tailwind v4 (`@tailwindcss/postcss`) 进行深度融合。所有核心组件不允许包含行内冗余样式，通用规范抽取为原子类。避免使用复杂的 CSS Modules。
