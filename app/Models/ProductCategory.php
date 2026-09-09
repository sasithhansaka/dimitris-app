<?php

namespace App\Models;

use App\Traits\LogsActivity;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $category_code
 * @property string $name
 * @property string|null $description
 * @property string|null $image
 * @property int $display_order
 * @property string $status
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['category_code', 'name', 'description', 'image', 'display_order', 'status'])]
class ProductCategory extends Model
{
    use LogsActivity;

    protected $table = 'product_categories';

    public const STATUS_ACTIVE = 'active';

    public const STATUS_INACTIVE = 'inactive';

    public const STATUS_DRAFT = 'draft';

    protected static function booted(): void
    {
        static::creating(function (ProductCategory $productCategory) {
            if (empty($productCategory->category_code)) {
                $productCategory->category_code = static::nextCategoryCode();
            }
        });
    }

    /**
     * Generate the next sequential category code (e.g. PCA-001).
     */
    public static function nextCategoryCode(): string
    {
        $lastCode = static::query()
            ->whereNotNull('category_code')
            ->orderByDesc('id')
            ->value('category_code');

        $nextNumber = 1;

        if ($lastCode && preg_match('/(\d+)$/', $lastCode, $matches)) {
            $nextNumber = ((int) $matches[1]) + 1;
        }

        return 'PCA-'.str_pad((string) $nextNumber, 3, '0', STR_PAD_LEFT);
    }

    /**
     * Suggest the next display order (one greater than the current highest).
     */
    public static function nextDisplayOrder(): int
    {
        return (int) static::query()->max('display_order') + 1;
    }

    public function products(): HasMany
    {
        return $this->hasMany(Product::class, 'category_id');
    }
}
