<script context="module">
  import { env } from '$lib/util/env';

  export const load = async ({ url, fetch }) => {
    const postsResp = await fetch(`/api/posts.json?${url.searchParams.toString()}`);
    const posts = await postsResp.json();

    return {
      props: {
        ...posts
      },
    };
  };
</script>

<script>
  import { page } from '$app/stores';

  import MetaData from '$lib/components/MetaData.svelte';
  import PostPreview from '$lib/components/PostPreview.svelte';
  import Pagination from '$lib/components/Pagination.svelte';

  export let posts = [];
  export let num_pages;
  export let page_size;
  export let current_page;

  $: tag = $page.url.searchParams.get('tag');
  $: meta = {
    title: `Posts tagged with '${tag}' :: Indie Engineer`,
    description: `Results for posts containing the tag '${tag}'`,
    image: "/site/indie-engineer-og-image.png",
    twitter_user: "@CoryParsnipson",
  };
</script>

<MetaData meta={meta} />

<main class="py-12">
  <h1 class="font-title leading-relaxed text-4.5xl mb-12">Posts Tagged with "<span class="font-title leading-relaxed text-4.5xl text-emerald-800">{tag}</span>":</h1>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
    {#each posts as post}
      <PostPreview
        metadata = {post.meta}
        path = {post.path}
      />
   {/each}
  </div>

  <Pagination
    currentPage={parseInt($page.url.searchParams.get('p')) || current_page}
    pageSize={parseInt($page.url.searchParams.get('size')) || page_size}
    minPage={1}
    maxPage={num_pages}
  />
</main>
