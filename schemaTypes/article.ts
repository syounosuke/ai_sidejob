export default {
  name: 'article',
  title: '記事',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'タイトル',
      type: 'string',
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'slug',
      title: 'スラッグ',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'thumbnail',
      title: 'サムネイル画像',
      type: 'image',
      options: {
        hotspot: true
      },
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'content',
      title: '記事内容',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: '標準', value: 'normal' },
            { title: '見出し1', value: 'h1' },
            { title: '見出し2', value: 'h2' },
            { title: '見出し3', value: 'h3' },
            { title: '見出し4', value: 'h4' },
            { title: '引用', value: 'blockquote' }
          ],
          lists: [
            { title: '番号付きリスト', value: 'number' },
            { title: '箇条書き', value: 'bullet' }
          ],
          marks: {
            decorators: [
              { title: '太字', value: 'strong' },
              { title: '斜体', value: 'em' },
              { title: '下線', value: 'underline' },
              { title: '打ち消し線', value: 'strike-through' },
              { title: 'コード', value: 'code' }
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'リンク',
                fields: [
                  {
                    name: 'href',
                    type: 'url',
                    title: 'URL'
                  },
                  {
                    name: 'blank',
                    type: 'boolean',
                    title: '新しいタブで開く'
                  }
                ]
              },
              {
                name: 'highlight',
                type: 'object',
                title: 'ハイライト',
                fields: [
                  {
                    name: 'color',
                    type: 'string',
                    title: '色',
                    options: {
                      list: [
                        { title: '黄色', value: 'yellow' },
                        { title: '青色', value: 'blue' },
                        { title: '緑色', value: 'green' },
                        { title: '赤色', value: 'red' }
                      ]
                    }
                  }
                ]
              }
            ]
          }
        },
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: '代替テキスト'
            },
            {
              name: 'caption',
              type: 'string',
              title: 'キャプション'
            }
          ]
        },
        {
          type: 'object',
          name: 'codeBlock',
          title: 'コードブロック',
          fields: [
            {
              name: 'language',
              type: 'string',
              title: '言語',
              options: {
                list: [
                  { title: 'JavaScript', value: 'javascript' },
                  { title: 'TypeScript', value: 'typescript' },
                  { title: 'HTML', value: 'html' },
                  { title: 'CSS', value: 'css' },
                  { title: 'Python', value: 'python' },
                  { title: 'Java', value: 'java' },
                  { title: 'C++', value: 'cpp' },
                  { title: 'Shell', value: 'shell' },
                  { title: 'JSON', value: 'json' },
                  { title: 'Markdown', value: 'markdown' },
                  { title: 'SQL', value: 'sql' },
                  { title: 'その他', value: 'text' }
                ]
              }
            },
            {
              name: 'code',
              type: 'text',
              title: 'コード',
              rows: 10
            },
            {
              name: 'filename',
              type: 'string',
              title: 'ファイル名（オプション）'
            }
          ]
        }
      ],
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'excerpt',
      title: '抜粋',
      type: 'text',
      description: '記事の短い要約（150文字程度）',
      rows: 3,
      validation: (Rule: any) => Rule.max(200)
    },
    {
      name: 'platform',
      title: 'プラットフォーム',
      type: 'string',
      options: {
        list: [
          { title: 'Blog', value: 'blog' },
          { title: 'Note', value: 'note' }
        ]
      },
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'isPopular',
      title: '人気記事',
      type: 'boolean',
      description: 'トップページに表示する人気記事かどうか',
      initialValue: false
    },
    {
      name: 'publishedAt',
      title: '公開日',
      type: 'datetime',
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'order',
      title: '表示順',
      type: 'number',
      description: '人気記事セクションでの表示順（小さい数字が先頭）',
      validation: (Rule: any) => Rule.min(0)
    }
  ],
  orderings: [
    {
      title: '表示順',
      name: 'orderAsc',
      by: [
        { field: 'order', direction: 'asc' }
      ]
    },
    {
      title: '公開日（新しい順）',
      name: 'publishedAtDesc',
      by: [
        { field: 'publishedAt', direction: 'desc' }
      ]
    }
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'platform',
      media: 'thumbnail'
    }
  }
}