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

  const meta = {
    title: "Indie Engineer",
    description: "This is a blog about eschewing the safety and routine of office work and trying to survive on the merit of one's own creations. Can an Engineer/Maker earn a living off of their own creations?",
    image: "/site/indie-engineer-og-image.png",
    twitter_user: "@CoryParsnipson",
  };
</script>

<MetaData meta={meta} />

<main class="py-12">
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
