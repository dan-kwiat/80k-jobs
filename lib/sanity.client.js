// This is the same as @sanity/client, and requires native Promises (so no IE support)
import { createClient } from "next-sanity"
import { sanityConfig } from "./config"

export const sanityClient = createClient(sanityConfig)
