<?php

namespace App\Models;

use App\Traits\LogsActivity;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $gift_code
 * @property int $brand_id
 * @property string $name
 * @property string $description
 * @property string $amount
 * @property string $currency
 * @property string|null $image
 * @property string $status
 * @property bool $featured
 * @property Carbon $start_date
 * @property Carbon $end_date
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['gift_code', 'brand_id', 'name', 'description', 'amount', 'currency', 'image', 'status', 'featured', 'start_date', 'end_date'])]
class GiftCard extends Model
{
    use LogsActivity;

    public const STATUS_ACTIVE = 'active';

    public const STATUS_INACTIVE = 'inactive';

    public const STATUS_DRAFT = 'draft';

    protected $casts = [
        'featured' => 'boolean',
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    protected static function booted(): void
    {
        static::creating(function (GiftCard $giftCard) {
            if (empty($giftCard->gift_code)) {
                $giftCard->gift_code = static::nextGiftCode();
            }
        });
    }

    /**
     * Generate the next sequential gift card code (e.g. GFT-001).
     */
    public static function nextGiftCode(): string
    {
        $lastCode = static::query()
            ->whereNotNull('gift_code')
            ->orderByDesc('id')
            ->value('gift_code');

        $nextNumber = 1;

        if ($lastCode && preg_match('/(\d+)$/', $lastCode, $matches)) {
            $nextNumber = ((int) $matches[1]) + 1;
        }

        return 'GFT-'.str_pad((string) $nextNumber, 3, '0', STR_PAD_LEFT);
    }

    public function brand(): BelongsTo
    {
        return $this->belongsTo(Brand::class);
    }

    public function favoritedByUsers(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'user_favorite_gift_cards')
            ->using(UserFavoriteGiftCard::class)
            ->withTimestamps();
    }
}
