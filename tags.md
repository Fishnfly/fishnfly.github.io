---
title: Tags
layout: page
permalink: /tags/
---

<a id="top"></a>
<p class="note">Browse stories by tag. Click a tag to jump to its section.</p>

<!-- Featured quick-jump tags -->
<ul class="tag-cloud">
  <li>#morocco#morocco</a></li>
  <li>#north-africa#north-africa</a></li>
  <li>#desert#desert</a></li>
  <li>#medina#medina</a></li>
  <li>#slow-travel#slow-travel</a></li>
  <li>#hot-air-balloons#hot-air-balloons</a></li>
</ul>

<hr />

{%- assign tag_names = site.tags | map: "first" | sort_natural -%}

<!-- All tags (auto) -->
<ul class="tag-cloud all-tags">
  {%- for tag_name in tag_names -%}
    <li>
      #{{ tag_name | slugify }}#{{ tag_name }}</a>
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
        {{ post.url | relative_url }}{{ post.title }}</a>
        <span class="meta"> — {{ post.date | date: "%b %-d, %Y" }}</span>
      </li>
    {%- endfor -%}
  </ul>

  <p class="back-to-top">#topBack to top ↑</a></p>
  <hr />
{%- endfor -%}
