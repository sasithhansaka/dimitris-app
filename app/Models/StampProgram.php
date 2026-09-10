<?php

namespace App\Models;

use App\Traits\LogsActivity;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $stamp_code
 * @property string $name
 * @property string $description
 * @property int $required_stamps
 * @property string $image
 * @property bool $featured
 * @property Carbon $start_date
 * @property Carbon $end_date
 * @property string $status
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['stamp_code', 'name', 'description', 'required_stamps', 'image', 'featured', 'start_date', 'end_date', 'status'])]
class StampProgram extends Model
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
        static::creating(function (StampProgram $stampProgram) {
            if (empty($stampProgram->stamp_code)) {
                $stampProgram->stamp_code = static::nextStampCode();
            }
        });
    }

    /**
     * Generate the next sequential stamp code (e.g. STAMP-001).
     */
    public static function nextStampCode(): string
    {
        $lastCode = static::query()
            ->whereNotNull('stamp_code')
            ->orderByDesc('id')
            ->value('stamp_code');

        $nextNumber = 1;

        if ($lastCode && preg_match('/(\d+)$/', $lastCode, $matches)) {
            $nextNumber = ((int) $matches[1]) + 1;
        }

        return 'STAMP-'.str_pad((string) $nextNumber, 3, '0', STR_PAD_LEFT);
    }

    public function products(): BelongsToMany
    {
        return $this->belongsToMany(Product::class, 'stamp_products')
            ->withTimestamps();
    }
}
