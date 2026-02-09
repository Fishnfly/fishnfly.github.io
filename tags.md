
---
title: Tags
layout: page
permalink: /tags/
---

<p class="note">Browse stories by tag. Click a tag to jump to its section.</p>

<!-- Tag cloud / jump list -->
<ul class="tag-cloud">
  {%- assign sorted_tags = site.tags | sort_natural -%}
  {%- for tag in sorted_tags -%}
    {%- assign tag_name = tag[0] -%}
    <li><a href="#{{ tag_name | slugify }}">{{ tag_name }}</a> <span class="count">{{ tag[1] | size }}</span></li>
  {%- endfor -%}
</ul>

<hr />

<!-- Sections per tag -->
{%- for tag in sorted_tags -%}
  {%- assign tag_name = tag[0] -%}
  {%- assign posts = tag[1] | sort: "date" | reverse -%}
  <h2 id="{{ tag_name | slugify }}">{{ tag_name }}</h2>
  <ul class="tag-list">
    {%- for post in posts -%}
      <li>
        <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
        <span class="meta"> — {{ post.date | date: "%b %-d, %Y" }}</span>
      </li>
    {%- endfor -%}
  </ul>
  <p class="back-to-top"><a href="#top">Back to top ↑</a></p>
  <hr />
{%- endfor -%}
