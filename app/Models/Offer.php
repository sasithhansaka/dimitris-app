<?php

namespace App\Models;

use App\Traits\LogsActivity;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
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
#[Fillable(['brand_id', 'title', 'description', 'image', 'start_date', 'end_date', 'status', 'featured'])]
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

    public function brand(): BelongsTo
    {
        return $this->belongsTo(Brand::class);
    }
}
