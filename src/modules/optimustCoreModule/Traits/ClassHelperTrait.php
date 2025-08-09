<?php

namespace Optimust\Core\Traits;

use Optimust\Core\Helper\ClassHelper;
use Optimust\Framework\Services;

trait ClassHelperTrait
{
    use ServiceContainerTrait;

    /**
     * @return ClassHelper
     */
    protected function getClassHelper(): ClassHelper
    {
        return $this->getContainer()->get(Services::CLASS_HELPER);
    }
}
