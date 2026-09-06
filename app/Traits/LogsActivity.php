<?php

namespace App\Traits;

use App\Models\ActivityLog;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Request;

trait LogsActivity
{
    /**
     * Boot the trait.
     */
    protected static function bootLogsActivity(): void
    {
        static::created(function ($model) {
            $model->logActivity(ActivityLog::ACTION_CREATE);
        });

        static::updated(function ($model) {
            $model->logActivity(ActivityLog::ACTION_UPDATE, $model->getOriginal());
        });

        static::deleted(function ($model) {
            $model->logActivity(ActivityLog::ACTION_DELETE);
        });
    }

    /**
     * Log the activity.
     */
    protected function logActivity(string $action, ?array $oldValues = null): void
    {
        if (! Auth::check()) {
            return;
        }

        /** @var User $actor */
        $actor = Auth::user();

        if (! $actor->isAdmin()) {
            return;
        }

        $entityName = class_basename(static::class);
        $title = $this->getActivityTitle();

        $logData = [
            'action' => $action,
            'entity' => $entityName,
            'title' => $title,
            'entity_id' => $this->getKey(),
            'user_id' => $actor->getKey(),
            'ip_address' => Request::ip(),
            'user_agent' => Request::userAgent(),
        ];

        switch ($action) {
            case ActivityLog::ACTION_CREATE:
                $logData['new_values'] = $this->getLoggableAttributes();
                $logData['details'] = "Created new {$entityName}: {$title}";
                break;

            case ActivityLog::ACTION_UPDATE:
                $changes = $this->getChangedAttributes($oldValues);

                if (empty($changes['old']) && empty($changes['new'])) {
                    return;
                }

                $logData['old_values'] = $changes['old'];
                $logData['new_values'] = $changes['new'];
                $logData['details'] = $this->generateUpdateDetails($changes);
                break;

            case ActivityLog::ACTION_DELETE:
                $logData['old_values'] = $this->getLoggableAttributes();
                $logData['details'] = "Deleted {$entityName}: {$title}";
                break;
        }

        ActivityLog::create($logData);
    }

    /**
     * Get the title for activity logging.
     */
    protected function getActivityTitle(): string
    {
        $titleFields = ['name', 'title', 'label', 'email'];

        foreach ($titleFields as $field) {
            if (! empty($this->attributes[$field] ?? null)) {
                return (string) $this->attributes[$field];
            }
        }

        return "#{$this->getKey()}";
    }

    /**
     * Get attributes that should be logged.
     */
    protected function getLoggableAttributes(): array
    {
        $attributes = $this->toArray();

        $excludeFields = [
            'id', 'password', 'remember_token', 'email_verified_at',
            'two_factor_secret', 'two_factor_recovery_codes', 'two_factor_confirmed_at',
            'created_at', 'updated_at', 'deleted_at',
        ];

        if (property_exists($this, 'loggableAttributes')) {
            return array_intersect_key($attributes, array_flip($this->loggableAttributes));
        }

        return array_diff_key($attributes, array_flip($excludeFields));
    }

    /**
     * Get changed attributes for update logging.
     */
    protected function getChangedAttributes(?array $oldValues = null): array
    {
        if (! $oldValues) {
            return ['old' => [], 'new' => []];
        }

        $newValues = $this->getLoggableAttributes();
        $changedOld = [];
        $changedNew = [];

        foreach ($newValues as $key => $newValue) {
            $oldValue = $oldValues[$key] ?? null;

            if ($oldValue != $newValue) {
                $changedOld[$key] = $oldValue;
                $changedNew[$key] = $newValue;
            }
        }

        return [
            'old' => $changedOld,
            'new' => $changedNew,
        ];
    }

    /**
     * Generate a human-readable update description.
     */
    protected function generateUpdateDetails(array $changes): string
    {
        $details = [];

        foreach ($changes['new'] as $field => $newValue) {
            $oldValue = $changes['old'][$field] ?? '';
            $fieldName = ucfirst(str_replace('_', ' ', $field));

            $details[] = sprintf(
                "%s: '%s' → '%s'",
                $fieldName,
                $this->valueToString($oldValue),
                $this->valueToString($newValue)
            );
        }

        return implode(', ', $details);
    }

    /**
     * Convert a value to string safely for logging.
     */
    protected function valueToString(mixed $value): string
    {
        if (is_null($value)) {
            return 'null';
        }

        if (is_bool($value)) {
            return $value ? 'true' : 'false';
        }

        if (is_array($value)) {
            return json_encode($value);
        }

        if (is_object($value)) {
            return get_class($value);
        }

        return (string) $value;
    }

    /**
     * Get activity logs for this model.
     */
    public function activityLogs()
    {
        return ActivityLog::where('entity', class_basename(static::class))
            ->where('entity_id', $this->getKey())
            ->orderBy('created_at', 'desc');
    }
}
