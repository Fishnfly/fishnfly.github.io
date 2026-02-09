---
title: Tags
layout: page
permalink: /tags/
---

<a id="top"></a>
Browse stories by tag. Click a tag to jump to its section.

## Quick Tags
[morocco](#morocco)  
[north-africa](#north-africa)  
[desert](#desert)  
[medina](#medina)  
[slow-travel](#slow-travel)  
[hot-air-balloons](#hot-air-balloons)

---

{% assign tag_names = site.tags | map: "first" | sort_natural %}

## All Tags
{% for tag_name in tag_names %}
- [{{ tag_name }}](#{{ tag_name | slugify }}) ({{ site.tags[tag_name] | size }})
{% endfor %}

---

## Posts by Tag

{% for tag_name in tag_names %}
### {{ tag_name }}
<a id="{{ tag_name | slugify }}"></a>

{% assign posts_for_tag = site.tags[tag_name] | sort: "date" | reverse %}

{% for post in posts_for_tag %}
- [{{ post.title }}]({{ post.url | relative_url }}) — {{ post.date | date: "%b %-d, %Y" }}
{% endfor %}

[Back to top ↑](#top)

---

{% endfor %}
