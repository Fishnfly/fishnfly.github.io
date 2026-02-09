---
title: Tags
layout: page
permalink: /tags/
---

<a id="top"></a>
<p class="note">Browse stories by tag. Click a tag to jump to its section.</p>

<!-- Optional: highlight a small set of “featured” tags first -->
<ul class="tag-cloud">
  <li><a href="#morocco">#morocco</a></li>
  <li><a href="#north-africa">#north-africa</a></li>
  <li><a href="#desert">#desert</a></li>
  <li><a href="#medina">#medina</a></li>
  <li><a href="#slow-travel">#slow-travel</a></li>
  <li><a href="#hot-air-balloons">#hot-air-balloons</a></li>
</ul>

<hr />

<!-- Build a list of tag names (strings only), sorted alphabetically -->
{%- assign tag_names = site.tags | map: "first" | sort_natural -%}

<!-- All tags with counts -->
<ul class="tag-cloud all-tags">
  {%- for tag_name in tag_names -%}
    <li>
      <a href="#{{ tag_name | slugify }}">#{{ tag_name }}</a>
      <span class="count">{{ site.tags[tag_name] | size }}</span>
    </li>
  {%- endfor -%}
</ul>

<hr />

<!-- Sections per tag (newest first) -->
{%- for tag_name in tag_names -%}
  <h2 id="{{ tag_name | slugify }}">{{ tag_name }}</h2>
  {%- assign posts_for_tag = site.tags[tag_name] | sort: "date" | reverse -%}
  <ul class="tag-list">
    {%- for post in posts_for_tag -%}
      <li>
        <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
        <span class="meta"> — {{ post.date | date: "%b %-d, %Y" }}</span>
      </li>
    {%- endfor -%}
  </ul>
  <p class="back-to-top"><a href="#top">Back to top ↑</a></p>
  <hr />
{%- endfor -%}
