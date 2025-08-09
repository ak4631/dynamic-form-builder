<?php

namespace Optimust\Core\Menu;

use Optimust\Entity\MenuItem;
use Optimust\Entity\Screen;

interface MenuConfigurator
{
    /**
     * @param Screen $screen
     * @return MenuItem|null
     */
    public function configure(Screen $screen): ?MenuItem;
}
