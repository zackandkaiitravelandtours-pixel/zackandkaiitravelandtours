<?php
/**
 * Travel Agency Email Handler
 * 
 * This PHP script handles email sending for the travel agency website.
 * It processes both general inquiries and booking requests.
 */

// Set content type to JSON
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

// Configuration
$config = [
    'admin_email' => 'admin@wanderlust-travel.com', // Change this to your admin email
    'admin_name' => 'Travel Agency Admin',
    'company_name' => 'Wanderlust Travel Agency',
    'smtp_host' => 'smtp.gmail.com', // Change to your SMTP server
    'smtp_port' => 587,
    'smtp_username' => '', // Your SMTP username
    'smtp_password' => '', // Your SMTP password
    'use_smtp' => false // Set to true to use SMTP, false to use PHP mail()
];

try {
    // Get JSON input
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);
    
    if (!$data) {
        throw new Exception('Invalid JSON data received');
    }
    
    // Validate required fields
    $required_fields = ['name', 'email', 'type'];
    foreach ($required_fields as $field) {
        if (empty($data[$field])) {
            throw new Exception("Missing required field: $field");
        }
    }
    
    // Sanitize data
    $data = array_map('sanitize_input', $data);
    
    // Validate email
    if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
        throw new Exception('Invalid email address');
    }
    
    // Prepare email content
    $email_data = prepareEmailContent($data, $config);
    
    // Send email
    if ($config['use_smtp']) {
        $result = sendEmailSMTP($email_data, $config);
    } else {
        $result = sendEmailPHP($email_data);
    }
    
    if ($result) {
        // Log the inquiry
        logInquiry($data);
        
        echo json_encode([
            'success' => true,
            'message' => 'Email sent successfully',
            'timestamp' => date('Y-m-d H:i:s')
        ]);
    } else {
        throw new Exception('Failed to send email');
    }
    
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'error' => $e->getMessage(),
        'timestamp' => date('Y-m-d H:i:s')
    ]);
}

/**
 * Sanitize input data
 */
function sanitize_input($data) {
    if (is_string($data)) {
        return htmlspecialchars(strip_tags(trim($data)), ENT_QUOTES, 'UTF-8');
    }
    return $data;
}

/**
 * Prepare email content based on inquiry type
 */
function prepareEmailContent($data, $config) {
    $subject = '';
    $message = '';
    
    if ($data['type'] === 'booking_request') {
        $subject = "New Booking Request: " . ($data['destination'] ?? 'Unknown Destination');
        $message = formatBookingEmail($data);
    } else {
        $subject = "New Travel Inquiry from " . $data['name'];
        $message = formatInquiryEmail($data);
    }
    
    return [
        'to' => $config['admin_email'],
        'to_name' => $config['admin_name'],
        'from' => $data['email'],
        'from_name' => $data['name'],
        'subject' => $subject,
        'message' => $message,
        'reply_to' => $data['email']
    ];
}

/**
 * Format booking request email
 */
function formatBookingEmail($data) {
    $message = "BOOKING REQUEST DETAILS\n";
    $message .= "========================\n\n";
    
    $message .= "Customer Information:\n";
    $message .= "- Name: " . $data['name'] . "\n";
    $message .= "- Email: " . $data['email'] . "\n";
    $message .= "- Phone: " . ($data['phone'] ?? 'Not provided') . "\n\n";
    
    $message .= "Travel Details:\n";
    $message .= "- Destination: " . ($data['destination'] ?? 'Not specified') . "\n";
    $message .= "- Number of Travelers: " . ($data['travelers'] ?? 'Not specified') . "\n";
    $message .= "- Preferred Departure: " . ($data['checkin'] ?? 'Not specified') . "\n";
    $message .= "- Trip Duration: " . ($data['duration'] ?? 'Not specified') . "\n";
    $message .= "- Budget Range: " . ($data['budget'] ?? 'Not specified') . "\n";
    $message .= "- Price Range: " . ($data['price'] ?? 'Not specified') . "\n\n";
    
    $message .= "Special Requests:\n";
    $message .= ($data['requests'] ?? 'None') . "\n\n";
    
    $message .= "Timestamp: " . ($data['timestamp'] ?? date('Y-m-d H:i:s')) . "\n\n";
    
    $message .= "Please contact the customer within 24 hours to finalize their booking.\n\n";
    $message .= "---\n";
    $message .= "This booking request was submitted through the travel agency website.";
    
    return $message;
}

/**
 * Format general inquiry email
 */
function formatInquiryEmail($data) {
    $message = "TRAVEL INQUIRY DETAILS\n";
    $message .= "======================\n\n";
    
    $message .= "Customer Information:\n";
    $message .= "- Name: " . $data['name'] . "\n";
    $message .= "- Email: " . $data['email'] . "\n";
    $message .= "- Phone: " . ($data['phone'] ?? 'Not provided') . "\n\n";
    
    $message .= "Travel Preferences:\n";
    $message .= "- Interested Destination: " . ($data['destination'] ?? 'Not specified') . "\n";
    $message .= "- Number of Travelers: " . ($data['travelers'] ?? 'Not specified') . "\n";
    $message .= "- Check-in Date: " . ($data['checkin'] ?? 'Not specified') . "\n";
    $message .= "- Check-out Date: " . ($data['checkout'] ?? 'Not specified') . "\n\n";
    
    $message .= "Message:\n";
    $message .= ($data['message'] ?? 'None') . "\n\n";
    
    $message .= "Timestamp: " . ($data['timestamp'] ?? date('Y-m-d H:i:s')) . "\n\n";
    
    $message .= "Please respond to this inquiry as soon as possible.\n\n";
    $message .= "---\n";
    $message .= "This inquiry was submitted through the travel agency website contact form.";
    
    return $message;
}

/**
 * Send email using PHP mail() function
 */
function sendEmailPHP($email_data) {
    $headers = [];
    $headers[] = "From: {$email_data['from_name']} <{$email_data['from']}>";
    $headers[] = "Reply-To: {$email_data['reply_to']}";
    $headers[] = "Content-Type: text/plain; charset=UTF-8";
    $headers[] = "X-Mailer: PHP/" . phpversion();
    
    return mail(
        $email_data['to'],
        $email_data['subject'],
        $email_data['message'],
        implode("\r\n", $headers)
    );
}

/**
 * Send email using SMTP (requires PHPMailer or similar)
 */
function sendEmailSMTP($email_data, $config) {
    // This is a basic implementation. For production, use PHPMailer or similar library
    // Example with PHPMailer:
    /*
    use PHPMailer\PHPMailer\PHPMailer;
    use PHPMailer\PHPMailer\SMTP;
    use PHPMailer\PHPMailer\Exception;
    
    $mail = new PHPMailer(true);
    
    try {
        $mail->isSMTP();
        $mail->Host       = $config['smtp_host'];
        $mail->SMTPAuth   = true;
        $mail->Username   = $config['smtp_username'];
        $mail->Password   = $config['smtp_password'];
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port       = $config['smtp_port'];
        
        $mail->setFrom($email_data['from'], $email_data['from_name']);
        $mail->addAddress($email_data['to'], $email_data['to_name']);
        $mail->addReplyTo($email_data['reply_to'], $email_data['from_name']);
        
        $mail->Subject = $email_data['subject'];
        $mail->Body    = $email_data['message'];
        
        return $mail->send();
    } catch (Exception $e) {
        throw new Exception("SMTP Error: {$mail->ErrorInfo}");
    }
    */
    
    // Fallback to PHP mail if SMTP is not properly configured
    return sendEmailPHP($email_data);
}

/**
 * Log inquiry to file for backup
 */
function logInquiry($data) {
    $log_file = 'inquiries.log';
    $log_entry = date('Y-m-d H:i:s') . " - " . json_encode($data) . "\n";
    
    // Create logs directory if it doesn't exist
    $log_dir = dirname($log_file);
    if (!is_dir($log_dir)) {
        mkdir($log_dir, 0755, true);
    }
    
    file_put_contents($log_file, $log_entry, FILE_APPEND | LOCK_EX);
}
?>