export default {
  name: 'profile',
  title: 'プロフィール',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: '名前',
      type: 'string',
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'catchphrase',
      title: 'キャッチフレーズ',
      type: 'string',
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'introduction',
      title: '自己紹介',
      type: 'text',
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'profileImage',
      title: 'プロフィール画像',
      type: 'image',
      options: {
        hotspot: true
      },
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'links',
      title: 'リンク',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'title',
              title: 'タイトル',
              type: 'string',
              validation: (Rule: any) => Rule.required()
            },
            {
              name: 'url',
              title: 'URL',
              type: 'url',
              validation: (Rule: any) => Rule.required()
            },
            {
              name: 'platform',
              title: 'プラットフォーム',
              type: 'string',
              options: {
                list: [
                  { title: 'Blog', value: 'blog' },
                  { title: 'X (Twitter)', value: 'twitter' },
                  { title: 'Note', value: 'note' },
                  { title: 'YouTube', value: 'youtube' }
                ]
              },
              validation: (Rule: any) => Rule.required()
            },
            {
              name: 'icon',
              title: 'アイコン',
              type: 'string',
              description: 'FontAwesome のクラス名 (例: fas fa-blog)',
              validation: (Rule: any) => Rule.required()
            }
          ],
          preview: {
            select: {
              title: 'title',
              subtitle: 'platform'
            }
          }
        }
      ]
    }
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'catchphrase',
      media: 'profileImage'
    }
  }
}