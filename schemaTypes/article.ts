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
      name: 'url',
      title: '記事URL',
      type: 'url',
      description: '外部記事のURL',
      validation: (Rule: any) => Rule.required()
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