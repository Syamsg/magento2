<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

namespace Magento\Customer\Model\Address\AbstractAddress;

use Magento\Directory\Model\Region;
use Magento\Framework\ObjectManager\ResetAfterRequestInterface;

/**
 * Cache of Region Models
 */
class RegionModelsCache implements ResetAfterRequestInterface
{
    /** @var array */
    private array $regionModels = [];

    /**
     * @inheritDoc
     */
    public function _resetState(): void
    {
        $this->regionModels = [];
    }

    /**
     * Adds model to cache using key
     *
     * @param string $key
     * @param Region $value
     * @return void
     */
    public function add(string $key, Region $model) : void
    {
        $this->regionModels[$key] = $model;
    }

    /**
     * Gets model from cache using key
     *
     * @param string $key
     * @return Region|null
     */
    public function get(string $key) : ?Region
    {
        return $this->regionModels[$key] ?? null;
    }
}
