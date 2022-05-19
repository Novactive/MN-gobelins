<?php

namespace App\Models\Presenters;

use App\Models\Article;
use App\Models\Presenters\Presenter;

class ArticlePresenter extends Presenter
{
    public function tagsAsString()
    {
        return $this->tags->map(function ($tag) {
            return $tag->name;
        })->implode(', ');
    }

    public function relatedArticles($qty = 3)
    {
        if ($this->section) {
            return Article::where('section_id', '=', $this->section->id)->limit($qty)->get();
        } else {
            return Article::orderBy('updated_at', 'DESC')->limit($qty)->get();
        }
    }

    public function featuredArticles()
    {
        $related = $this->related;
        if ($related->count() > 0) {
            return $related;
        } else {
            return $this->relatedArticles(3);
        }
    }

    /**
     * Retreive all photographic credits from all blocks of this article.
     *
     * @return Collection
     */
    public function photoCredits()
    {
        return $this->blocks->pluck('medias')->reject(function ($c) {return $c->isEmpty();})->flatten()->pluck('credit')->filter()->unique();
    }
}
