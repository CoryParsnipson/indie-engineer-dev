<script>
  import { onMount } from 'svelte';
  import { page } from '$app/stores';

  import Ad from '$lib/components/Ad.svelte';
  import Categories from '$lib/components/Categories.svelte';
  import MailSignupForm from '$lib/components/MailSignupForm.svelte';
  import MetaData from '$lib/components/MetaData.svelte';
  import ShareLinks from '$lib/components/ShareLinks.svelte';
  import TableOfContents from '$lib/components/TableOfContents.svelte';

  import { env } from '$lib/util/env';
  import { slugify } from '$lib/util/string';

  // frontmatter exports
  export let title;
  export let seo_title = undefined; // goes in meta title tag, if defined (falls back to title)
  export let summary;
  export let seo_summary = undefined; // goes in meta description tag, if defined (falls back to summary)
  export let seo_image = undefined; // goes in meta og:image tag, if defined (no default)
  export let author;
  export let date;
  export let readingTime;
  export let categories = [];

  const meta = {
    title: (seo_title ? seo_title : title) + " :: Indie Engineer",
    description: (seo_summary ? seo_summary : summary),
    type: "article",
    image: seo_image,
    twitter_user: "@CoryParsnipson",
  };

  let sidebar_on_left = false;
  let title_slug = slugify(title);
  let readable_date = new Date(date).toLocaleDateString('en-us', { dateStyle: "long" });

  let toc_data = [];

  onMount(async () => {
    let ad_top = document.getElementById("ad-top");
    let contents = document.getElementsByClassName("contents")[0];
    let paragraphs = contents?.getElementsByTagName("p");
    if (ad_top && paragraphs && paragraphs.length >= 2) {
      paragraphs[0].parentNode.insertBefore(ad_top, paragraphs[0].nextSibling);
    }

    // gather data for table of contents
    let headings = document.getElementsByTagName('main')[0].querySelectorAll('h1,h2,h3,h4');
    headings.forEach(heading => {
      if (!heading.lastChild.hash) {
        return;
      }

      toc_data.push({
        tag: heading.tagName.toLowerCase(),
        text: heading.innerText,
        link: heading.lastChild.hash,
      });
      toc_data = toc_data; // assign here for reactive updates
    });
  });
</script>

<MetaData meta={meta} />

<div class="flex justify-center" class:flex-row-reverse={sidebar_on_left}>
  <main class="bg-cream-50 flex-initial w-[100% + 2.5rem] md:max-w-[700px] lg:w-[70%] px-4 sm:px-8 overflow-hidden -ml-5 -mr-5 sm:mx-0 py-12">
    <Categories {categories} />
    <h1 id="{title_slug}">{title}
      <a aria-hidden="true" tabindex="-1" href="#{title_slug}">
        <span class="icon icon-link"></span>
      </a>
    </h1>

    <div class="subtitle flex flex-col sm:flex-row sm:flex-wrap justify-start">
      {#if author}<p class="font-serif text-lg sm:text-xl text-zinc-600 my-1 sm:my-0">by {author}</p>{/if}
      {#if date}<p class="font-serif text-lg sm:text-xl text-zinc-600 my-1 sm:my-0">{readable_date}</p>{/if}
      {#if readingTime?.text}<p class="font-serif text-emerald-800 text-lg sm:text-xl my-1 sm:my-0">{readingTime.text}</p>{/if}
    </div>

    <div class="w-2/12 sm:w-1/12 mt-5 mb-5 border-t-4 border-emerald-700"></div>
    <div class="mb-8"></div>

    <div class="mb-12">
      <ShareLinks show_title={false} />
    </div>

    <Ad id={"ad-top"} width={"100%"} max_width={"600px"} height={"100px"} show={env.var.VITE_SHOW_ADS} />

    <div class="contents">
      <slot />
    </div>

    <MailSignupForm />

    <ShareLinks />

    <Ad width={"100%"} max_width={"600px"} height={"250px"} show={env.var.VITE_SHOW_ADS} />
  </main>

  <sidebar class="w-[30%] relative hidden lg:block ml-5 py-6">
    <!-- top-32 spacing here on the sticky div is arbitrary, but must be bigger than py-6 to prevent jitter -->
    <div class="sticky top-32 border-cream-500">
      <TableOfContents headings={toc_data} />
      <Ad width={"250px"} height={"250px"} show={env.var.VITE_SHOW_ADS} />
    </div>
  </sidebar>
</div>

<style>
  /* markdown styles */

  /* headers */
  /* ------------------------------------------------------------------------ */
  :global(main h1, main h1 :is(em, strong)),
  :global(main h2, main h2 :is(em, strong)),
  :global(main h3, main h3 :is(em, strong)),
  :global(main h4, main h4 :is(em, strong)),
  :global(main h5, main h5 :is(em, strong)),
  :global(main h6, main h6 :is(em, strong)) {
    /* NOTE: scroll-mt is hardcoded, but the value should be dependent on header height */
    @apply relative font-title scroll-mt-28;
  }

  :global(main h1, main h1 :is(em, strong)) {
    @apply text-4xl tracking-tight leading-snug mt-2 mb-4;
  }

  /* need to use vanilla media query because complex class ('sm:') causes compilation issue (svelte bug?) */
  @media (min-width: 640px) {
    :global(main h1, main h1 :is(em, strong)) {
      @apply text-4.5xl leading-relaxed mt-2 mb-4;
    }
  }

  :global(main h2, main h2 :is(em, strong)) {
    @apply text-3xl mb-8;
  }

  :global(main h3, main h3 :is(em, strong)) {
    @apply text-2xl text-zinc-700 mb-6;
  }

  :global(main h4, main h4 :is(em, strong)) {
    @apply text-2xl text-emerald-800 mb-4;
  }

  :global(main h5, main h5 :is(em, strong)) {
    @apply text-2xl text-emerald-800 mb-4;
  }

  :global(main h6, main h6 :is(em, strong)) {
    @apply text-base text-emerald-800;
  }

  /* rehype autolink header styles */
  /* ------------------------------------------------------------------------ */
  :global(main a[href^="#"]) {
    @apply inline-block absolute bottom-[10%] min-w-[1.05rem] min-h-[1.05rem] mx-2 my-2;
  }

  :global(main span[class*="icon-link"]) {
    @apply w-full h-full inline-block absolute top-0;
  }

  :global(main h1:hover span[class*="icon-link"]),
  :global(main h2:hover span[class*="icon-link"]),
  :global(main h3:hover span[class*="icon-link"]),
  :global(main h4:hover span[class*="icon-link"]),
  :global(main h5:hover span[class*="icon-link"]),
  :global(main h6:hover span[class*="icon-link"]) {
    @apply bg-[url('/site/icon-link.png')] bg-cover;
  }

  /* inline text */
  /* ------------------------------------------------------------------------ */
  :global(main) {
    @apply font-serif;
  }

  :global(main p), :global(main em), :global(main strong) {
    @apply text-lg font-serif mb-10 leading-relaxed tracking-markdown;
  }

  @media (min-width: 640px) {
    :global(main p), :global(main em), :global(main strong) {
      @apply text-lg font-serif mb-10 leading-loose tracking-markdown;
    }
  }

  :global(main p code) {
    @apply text-base;
  }

  /* block quote */
  /* ------------------------------------------------------------------------ */
  :global(main blockquote) {
    @apply text-zinc-700 bg-cream-100 rounded-xl relative italic py-6 pl-16 pr-4 ml-4 mr-6 mb-12;
  }

  :global(main blockquote::before) {
    content: '';
    background-image: url('/site/icon-blockquote.png');
    background-size: 3rem;
    @apply opacity-50 w-[3rem] h-[3rem] absolute top-2 left-2;
  }

  :global(main blockquote p) {
    @apply mb-0;
  }

  :global(main blockquote a) {
    @apply border border-dashed border-transparent;
  }

  :global(main blockquote a:hover) {
    @apply border border-dashed border-cream-500;
  }

  /* inline hyperlinks */
  /* ------------------------------------------------------------------------ */
  :global(main .contents a) {
    @apply text-lg text-emerald-700 font-serif underline py-1 pr-0.5;
  }

  /* no external link icon for internal hyperlinks */
  :global(main .contents a[rel]:after) {
    content: '';
    @apply inline-block align-baseline min-w-[1.03rem] min-h-[1.03rem] bg-[url('/site/icon-external-link.png')] bg-cover ml-1;
  }

  :global(main .contents a:hover) {
    @apply bg-cream-100;
  }

  :global(main .contents main a:active) {
    @apply text-red-700;
  }

  :global(main .contents main a:visited) {
    @apply text-emerald-700;
  }

  /* inline list styles */
  /* ------------------------------------------------------------------------ */
  :global(main ul) {
    @apply list-disc;
  }

  :global(main ol) {
    @apply list-decimal;
  }

  :global(main ul, main ol) {
    @apply list-outside ml-6 mb-10;
  }

  :global(main li) {
    @apply text-lg font-serif leading-relaxed tracking-markdown pl-4 mb-2;
  }

  @media (min-width: 640px) {
    :global(main li) {
      @apply text-lg font-serif leading-loose tracking-markdown pl-4 mb-2;
    }
  }

  /* images */
  /* ------------------------------------------------------------------------ */
  :global(main img, main p img) {
    @apply mx-auto;
  }

  :global(main .contents > img) {
    @apply mb-12;
  }

  :global(main figure) {
    @apply mb-5;
  }

  :global(main figure figcaption) {
    @apply font-serif text-lg italic text-center;
  }

  /* code block */
  /* ------------------------------------------------------------------------ */
  :global(main pre span), :global(main code span) {
    @apply font-mono;
  }

  :global(main pre), :global(main pre[class*="language-"]) {
    @apply rounded-2xl p-6 my-3;
  }

  :global(main code[class*="language-"]) {
    @apply inline-block;
  }

  /* subtitle styles */
  /* ------------------------------------------------------------------------ */
  /* need to use vanilla media query because complex class ('sm:') causes compilation issue (svelte bug?) */
  @media (min-width: 640px) {
    :global(main div.subtitle p:not(:first-child)::before) {
      @apply content-['·'] px-4;
    }
  }
</style>
