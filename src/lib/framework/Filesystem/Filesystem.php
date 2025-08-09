<?php

namespace Optimust\Framework\Filesystem;

use Symfony\Component\Filesystem\Exception\IOException;

class Filesystem extends \Symfony\Component\Filesystem\Filesystem
{
    /**
     * @inheritDoc
     */
    public function dumpFile(string $filename, $content): void
    {
        $dir = dirname($filename);

        if (!is_dir($dir)) {
            $this->mkdir($dir);
        }

        $error = null;
        set_error_handler(static function (int $errno, string $errStr) use (&$error) {
            $error = $errStr;
        });
        try {
            file_put_contents($filename, $content);
        } finally {
            restore_error_handler();
        }
        if ($error !== null) {
            throw new IOException("Failed to write file \"$filename\": " . $error, 0, null, $filename);
        }
    }
}
