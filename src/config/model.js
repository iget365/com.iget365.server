export const model = {
  link: {
    as: 'Link',
    model: 'Link',
    validation: {
      title: {
        test: 'required',
        msg: 'invalid title.'
      },
      url: {
        test: 'required', // todo url
        msg: 'invalid url.'
      }
    },
    limit: 10
  },
  text: {
    as: 'Text',
    model: 'Text',
    validation: {
      content: {
        test: 'required',
        msg: 'invalid content.'
      }
    },
    limit: 10
  }
}
