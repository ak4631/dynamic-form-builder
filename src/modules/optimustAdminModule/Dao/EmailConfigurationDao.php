<?php

namespace Optimust\Admin\Dao;

use Optimust\Core\Dao\BaseDao;
use Optimust\Entity\EmailConfiguration;

class EmailConfigurationDao extends BaseDao
{
    /**
     * @return EmailConfiguration|null
     */
    public function getEmailConfiguration(): ?EmailConfiguration
    {
        $q = $this->createQueryBuilder(EmailConfiguration::class, 'e');
        $emailConfig = $this->fetchOne($q);
        if ($emailConfig instanceof EmailConfiguration) {
            return $emailConfig;
        }
        return null;
    }

    /**
     * @param EmailConfiguration $emailConfiguration
     * @return EmailConfiguration
     */
    public function saveEmailConfiguration(EmailConfiguration $emailConfiguration): EmailConfiguration
    {
        $this->persist($emailConfiguration);
        return $emailConfiguration;
    }
}
