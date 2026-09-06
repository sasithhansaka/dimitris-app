<?php

namespace App\Models;

use App\Traits\HasUniqueSlug;
use App\Traits\LogsActivity;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $title
 * @property string $slug
 * @property string|null $introduction
 * @property string $content
 * @property string|null $banner
 * @property string|null $keywords
 * @property string $status
 * @property int $read_time
 * @property bool $featured
 * @property int $article_category_id
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['title', 'slug', 'introduction', 'content', 'banner', 'keywords', 'status', 'read_time', 'featured', 'article_category_id'])]
class Article extends Model
{
    use HasUniqueSlug, LogsActivity;

    protected $casts = [
        'featured' => 'boolean',
    ];

    public const STATUS_ACTIVE = 'active';

    public const STATUS_INACTIVE = 'inactive';

    public const STATUS_DRAFT = 'draft';

    public function category(): BelongsTo
    {
        return $this->belongsTo(ArticleCategory::class, 'article_category_id');
    }
}
