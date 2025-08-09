<?php

namespace Optimust\Admin\Service;

use Exception;
use Optimust\Admin\Dao\EmailConfigurationDao;
use Optimust\Core\Service\EmailService;

class EmailConfigurationService
{
    /**
     * @var EmailConfigurationDao|null
     */
    private ?EmailConfigurationDao $emailConfigurationDao = null;

    /**
     * @var null|EmailService
     */
    protected ?EmailService $emailService = null;

    /**
     * @return EmailConfigurationDao|null
     */
    public function getEmailConfigurationDao(): EmailConfigurationDao
    {
        if (!($this->emailConfigurationDao instanceof EmailConfigurationDao)) {
            $this->emailConfigurationDao = new EmailConfigurationDao();
        }
        return $this->emailConfigurationDao;
    }

    /**
     * @return EmailService
     */
    public function getEmailService(): EmailService
    {
        if (is_null($this->emailService)) {
            $this->emailService = new EmailService();
        }
        return $this->emailService;
    }

    /**
     * @param EmailService $emailService
     */
    public function setEmailService(EmailService $emailService): void
    {
        $this->emailService = $emailService;
    }

    /**
     * @param string $testEmail
     * @return bool
     * @throws Exception
     */
    public function sendTestMail(string $testEmail)
    {
        return $this->getEmailService()->sendTestEmail($testEmail);
    }
}
