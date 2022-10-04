import Head from "next/head"
import { HOME_OG_IMAGE_URL } from "../lib/constants"

const title = "Jobs | 80,000 Hours"
const description =
  "Some of these roles directly address some of the world’s most pressing problems, while others may help you build the career capital you need to have a big impact later."
const url = "https://80k-jobs.vercel.app/"

export default function Meta() {
  return (
    <Head>
      <title>{title}</title>
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/favicon/apple-touch-icon.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon/favicon-16x16.png"
      />
      <link rel="manifest" href="/favicon/site.webmanifest" />
      <link
        rel="mask-icon"
        href="/favicon/safari-pinned-tab.svg"
        color="#000000"
      />
      <link rel="shortcut icon" href="/favicon/favicon.ico" />
      <meta name="msapplication-TileColor" content="#000000" />
      <meta name="msapplication-config" content="/favicon/browserconfig.xml" />
      <meta name="theme-color" content="#000" />
      <link rel="alternate" type="application/rss+xml" href="/feed.xml" />
      <meta name="description" content={description} />
      <meta property="og:image" content={HOME_OG_IMAGE_URL} key="ogImage" />]
      {/* OPEN GRAPH */}
      <meta key="og:url" property="og:url" content={url} />
      <meta key="og:title" property="og:title" content={title} />
      <meta
        key="og:description"
        property="og:description"
        content={description}
      />
      <meta key="og:type" property="og:type" content="website" />
      {/* This image is used in facebook shares. Preferred aspect ratio 1.9:1 */}
      <meta key="og:image" property="og:image" content={HOME_OG_IMAGE_URL} />
      <meta
        key="og:image:secure_url"
        property="og:image:secure_url"
        content={HOME_OG_IMAGE_URL}
      />
      <meta key="og:image:type" property="og:image:type" content="image/png" />
      <meta key="og:image:width" property="og:image:width" content={"1200"} />
      <meta key="og:image:height" property="og:image:height" content={"630"} />
      {/* TWITTER CARD */}
      <meta
        key="twitter:card"
        name="twitter:card"
        content="summary_large_image"
      />
      <meta key="twitter:site" name="twitter:site" content="@80000Hours" />
      <meta key="twitter:title" name="twitter:title" content={title} />
      <meta
        key="twitter:description"
        name="twitter:description"
        content={description}
      />
      {/* This image is used in twitter shares. */}
      {/* Preferred aspect ratio 1:1 & 2:1 for "summary" & "summary_large_image" respectively */}
      <meta
        key="twitter:image"
        name="twitter:image"
        content={HOME_OG_IMAGE_URL}
      />
    </Head>
  )
}
