<?php

namespace App\Models;

use App\Traits\LogsActivity;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $offer_code
 * @property int $brand_id
 * @property string $title
 * @property string $description
 * @property string $image
 * @property Carbon $start_date
 * @property Carbon $end_date
 * @property string $status
 * @property bool $featured
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['offer_code', 'brand_id', 'title', 'description', 'image', 'start_date', 'end_date', 'status', 'featured'])]
class Offer extends Model
{
    use LogsActivity;

    public const STATUS_ACTIVE = 'active';

    public const STATUS_INACTIVE = 'inactive';

    public const STATUS_DRAFT = 'draft';

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'featured' => 'boolean',
    ];

    protected static function booted(): void
    {
        static::creating(function (Offer $offer) {
            if (empty($offer->offer_code)) {
                $offer->offer_code = static::nextOfferCode();
            }
        });
    }

    /**
     * Generate the next sequential offer code (e.g. OFF-001).
     */
    public static function nextOfferCode(): string
    {
        $lastCode = static::query()
            ->whereNotNull('offer_code')
            ->orderByDesc('id')
            ->value('offer_code');

        $nextNumber = 1;

        if ($lastCode && preg_match('/(\d+)$/', $lastCode, $matches)) {
            $nextNumber = ((int) $matches[1]) + 1;
        }

        return 'OFF-'.str_pad((string) $nextNumber, 3, '0', STR_PAD_LEFT);
    }

    public function brand(): BelongsTo
    {
        return $this->belongsTo(Brand::class);
    }
}
