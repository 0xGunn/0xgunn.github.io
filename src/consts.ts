import type { IconMap, SocialLink, Site, CommentConfig } from '@/types'

export const SITE: Site = {
  title: '0xGunn',
  description:
    '0xGunn is a blog about security research, programming, and technology.',
  href: 'https://0xGunn.vercel.app',
  author: 'jktrn',
  locale: 'en-US',
  featuredPostCount: 2,
  postsPerPage: 3,
}

export const NAV_LINKS: SocialLink[] = [
  {
    href: '/blog',
    label: 'blog',
  },
  {
    href: '/tags',
    label: 'tags',
  },
  {
    href: '/archives',
    label: 'archives',
  },
  {
    href: '/authors',
    label: 'authors',
  },
  {
    href: '/about',
    label: 'about',
  },
]

export const SOCIAL_LINKS: SocialLink[] = [
  {
    href: 'https://github.com/0xGunn',
    label: 'GitHub',
  },
  {
    href: 'https://x.com/vieTin_',
    label: 'Twitter',
  },
  {
    href: 'mailto:nviettin48@gmail.com',
    label: 'Email',
  },
  {
    href: '/rss.xml',
    label: 'RSS',
  },
]

export const ICON_MAP: IconMap = {
  Website: 'lucide:globe',
  GitHub: 'lucide:github',
  LinkedIn: 'lucide:linkedin',
  Twitter: 'lucide:twitter',
  Email: 'lucide:mail',
  RSS: 'lucide:rss',
}

export const COMMENT: CommentConfig = {
  repo: '0xGunn/0xgunn.github.io',
  repoId: 'R_kgDORCN8oQ',
  category: 'Comments',
  categoryId: 'DIC_kwDORCN8oc4C1e84',
}
