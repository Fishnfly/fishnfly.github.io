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
      {{ post.url | relative_url }}
        {%- if post.image -%}
          {{ post.image | relative_url }}
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
