<?php

namespace Optimust\Core\HomePage;

use Optimust\Entity\User;

interface HomePageEnablerInterface
{
    /**
     * @param User $user
     * @return bool
     */
    public function isEnabled(User $user): bool;
}
