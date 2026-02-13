---
layout: page
title: Stories
permalink: /stories/
---

Stories are how travel becomes meaningful. These are not guides or recommendations, but narratives shaped by time on the ground.

## All Stories

<div class="card-grid">
  {%- for post in site.posts -%}
    <article class="card">
      <a class="card-link" href="{{ post.url | relative_url }}" aria-label="{{ post.title | escape }}">
        {%- if post.image -%}
          <img class="card-img" src="{{ post.image | relative_url }}" alt="{{ post.title | escape }}">
        {%- else -%}
          <div class="card-img placeholder" aria-hidden="true"></div>
        {%- endif -%}
        <h3 class="card-title">{{ post.title | escape }}</h3>
        <p class="card-meta">{{ post.date | date: "%b %-d, %Y" }}</p>
      </a>
    </article>
  {%- endfor -%}
</div>

---
