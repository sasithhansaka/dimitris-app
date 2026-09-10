<?php

namespace App\Models;

use App\Traits\HasUniqueSlug;
use App\Traits\LogsActivity;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $faq_code
 * @property string $name
 * @property string $slug
 * @property string|null $description
 * @property string|null $banner
 * @property int $display_order
 * @property string $status
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['faq_code', 'name', 'slug', 'description', 'banner', 'display_order', 'status'])]
class FaqCategory extends Model
{
    use HasUniqueSlug, LogsActivity;

    public const STATUS_ACTIVE = 'active';

    public const STATUS_INACTIVE = 'inactive';

    public const STATUS_DRAFT = 'draft';

    protected static function booted(): void
    {
        static::creating(function (FaqCategory $faqCategory) {
            if (empty($faqCategory->faq_code)) {
                $faqCategory->faq_code = static::nextFaqCode();
            }
        });
    }

    /**
     * Generate the next sequential FAQ code (e.g. FAQ-001).
     */
    public static function nextFaqCode(): string
    {
        $lastCode = static::query()
            ->whereNotNull('faq_code')
            ->orderByDesc('id')
            ->value('faq_code');

        $nextNumber = 1;

        if ($lastCode && preg_match('/(\d+)$/', $lastCode, $matches)) {
            $nextNumber = ((int) $matches[1]) + 1;
        }

        return 'FAQ-'.str_pad((string) $nextNumber, 3, '0', STR_PAD_LEFT);
    }

    /**
     * Suggest the next display order (one greater than the current highest).
     */
    public static function nextDisplayOrder(): int
    {
        return (int) static::query()->max('display_order') + 1;
    }

    public function faqs(): HasMany
    {
        return $this->hasMany(Faq::class)->orderBy('display_order');
    }
}
