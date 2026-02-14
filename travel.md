---
layout: page
title: "Travel"
permalink: /travel.html
---

{% raw %}
<section class="travel-intro" aria-label="Travel intro">
  <h2>Traveling farther. <em>Fishing better.</em> Stories around the world.</h2>
  <p><strong>Moving slowly, noticing more.</strong> Stories from places where time lingers.</p>
</section>
{% endraw %}

<!-- 1) Dynamic Travel Grid -->
<section aria-labelledby="travel-grid-heading">
  <h2 id="travel-grid-heading" class="sr-only">Stories in Travel</h2>

  <div class="card-grid">
    {% assign featured = site.posts
      | where_exp: 'item', 'item.categories contains "travel"'
      | sort: 'date'
      | reverse
      | slice: 0, 6 %}

    {% for post in featured %}
      {% include card-thumb.html
        url=post.url
        img_src=post.thumbnail.base
        img_src_640=post.thumbnail.w640
        img_src_960=post.thumbnail.w960
        img_src_1280=post.thumbnail.w1280
        alt=post.thumbnail.alt
        location=post.location
        title=post.title
        dek=post.dek
      %}
    {% endfor %}
  </div>
</section>
