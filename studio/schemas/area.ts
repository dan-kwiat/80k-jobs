export default {
  name: "area",
  title: "Area",
  type: "document",
  fields: [
    {
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    // {
    //   name: "slug",
    //   title: "Slug",
    //   type: "slug",
    //   options: {
    //     source: "name",
    //   },
    //   validation: (Rule) => Rule.required(),
    // },
  ],
}
