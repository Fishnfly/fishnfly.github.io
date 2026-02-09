---
title: Tags
layout: page
permalink: /tags/
---

<p class="note">Browse stories by tag. Click a tag to jump to its section.</p>

<!-- Highlight your core tags (hand-curated jump list) -->
<ul class="tag-cloud">
  <!-- These are the tags you mentioned; edit as needed -->
  <li>#moroccoMorocco</a></li>
  <li>#north-africaNorth Africa</a></li>
  <li>#desertDesert</a></li>
  <li>#medinaMedina</a></li>
  <li>#slow-travelSlow Travel</a></li>
  <li>#hot-air-balloonsHot Air Balloons</a></li>
</ul>

<hr />

<!-- Full automatic tag list (alphabetical) with counts -->
{%- assign sorted_tags = site.tags | sort_natural -%}
<ul class="tag-cloud all-tags">
  {%- for tag in sorted_tags -%}
    {%- assign tag_name = tag[0] -%}
    <li>#{{ tag_name | slugify }}{{ tag_name }}</a> <span class="count">{{ tag[1] | size }}</span></li>
  {%- endfor -%}
</ul>

<hr />

<!-- Sections per tag, newest posts first -->
{%- for tag in sorted_tags -%}
  {%- assign tag_name = tag[0] -%}
  {%- assign posts = tag[1] | sort: "date" | reverse -%}
  <h2 id="{{ tag_name | slugify }}">{{ tag_name }}</h2>
  <ul class="tag-list">
    {%- for post in posts -%}
      <li>
        {{ post.url | relative_url }}{{ post.title }}</a>
        <span class="meta"> — {{ post.date | date: "%b %-d, %Y" }}</span>
      </li>
    {%- endfor -%}
  </ul>
  <p class="back-to-top">#topBack to top ↑</a></p>
  <hr />
{%- endfor -%}
