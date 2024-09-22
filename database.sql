-- Create Database
CREATE DATABASE crowdfunding_db;
USE crowdfunding_db;

-- Create Category Table
CREATE TABLE CATEGORY (
    CATEGORY_ID INT AUTO_INCREMENT PRIMARY KEY,
    NAME VARCHAR(100) NOT NULL,
    DESCRIPTION TEXT
);

-- Create Fundraiser Table
CREATE TABLE FUNDRAISER (
    FUNDRAISER_ID INT AUTO_INCREMENT PRIMARY KEY,
    ORGANIZER VARCHAR(100) NOT NULL,
    CAPTION VARCHAR(255) NOT NULL,
    DESCRIPTION TEXT,
    TARGET_FUNDING DECIMAL(10, 2) NOT NULL,
    CURRENT_FUNDING DECIMAL(10, 2) DEFAULT 0.00,
    CITY VARCHAR(100),
    ACTIVE BOOLEAN DEFAULT TRUE,
    CATEGORY_ID INT,
    CREATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UPDATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_category FOREIGN KEY (CATEGORY_ID) REFERENCES CATEGORY(CATEGORY_ID) ON DELETE SET NULL
);

-- Create Donations Table
CREATE TABLE DONATION (
    DONATION_ID INT AUTO_INCREMENT PRIMARY KEY,
    DONOR_NAME VARCHAR(100) NOT NULL,
    AMOUNT DECIMAL(10, 2) NOT NULL,
    FUNDRAISER_ID INT,
    DONATION_DATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_fundraiser FOREIGN KEY (FUNDRAISER_ID) REFERENCES FUNDRAISER(FUNDRAISER_ID) ON DELETE CASCADE
);

-- Create an index to speed up searches by fundraisers in specific cities and by categories
CREATE INDEX idx_fundraiser_city ON FUNDRAISER(CITY);
CREATE INDEX idx_fundraiser_category ON FUNDRAISER(CATEGORY_ID);
-- Insert Data into Category Table
INSERT INTO CATEGORY (NAME, DESCRIPTION) VALUES 
('Medical', 'Fundraisers related to medical needs and treatments'),
('Education', 'Fundraisers for educational purposes'),
('Crisis Relief', 'Fundraisers to help people in times of crisis'),
('Social Impact', 'Fundraisers for social impact initiatives');

-- Insert Data into Fundraiser Table
INSERT INTO FUNDRAISER (ORGANIZER, CAPTION, DESCRIPTION, TARGET_FUNDING, CURRENT_FUNDING, CITY, ACTIVE, CATEGORY_ID) VALUES 
('John Doe', 'Help John fight cancer', 'Raising money for John\'s medical treatment', 5000.00, 1200.00, 'Sydney', TRUE, 1),
('Sarah Smith', 'Support Sarah\'s education', 'Fundraiser for tuition fees for Sarah\'s higher education', 10000.00, 3000.00, 'Melbourne', TRUE, 2),
('Byron Community', 'Flood Relief for Byron Bay', 'Help rebuild the community after severe flooding', 25000.00, 15000.00, 'Byron Bay', TRUE, 3),
('Jane NGO', 'Empower Women Through Education', 'Providing education and resources to underprivileged women', 20000.00, 5000.00, 'Brisbane', TRUE, 2),
('Save the Children', 'Crisis Relief in Somalia', 'Providing aid to children in crisis zones in Somalia', 50000.00, 20000.00, 'Perth', TRUE, 3);

-- Insert Data into Donation Table
INSERT INTO DONATION (DONOR_NAME, AMOUNT, FUNDRAISER_ID) VALUES 
('Alice Cooper', 100.00, 1),
('Bob Marley', 250.00, 3),
('Jane Austen', 50.00, 2),
('Peter Parker', 300.00, 4),
('Clark Kent', 500.00, 5);
-- Fetch All Active Fundraisers
DELIMITER //
CREATE PROCEDURE get_active_fundraisers()
BEGIN
    SELECT 
        FUNDRAISER_ID, ORGANIZER, CAPTION, DESCRIPTION, TARGET_FUNDING, CURRENT_FUNDING, CITY, CATEGORY.NAME AS CATEGORY_NAME, ACTIVE
    FROM FUNDRAISER
    JOIN CATEGORY ON FUNDRAISER.CATEGORY_ID = CATEGORY.CATEGORY_ID
    WHERE ACTIVE = TRUE;
END //
DELIMITER ;

-- Fetch Fundraisers Based on Category or City
DELIMITER //
CREATE PROCEDURE search_fundraisers(IN city VARCHAR(100), IN category_id INT)
BEGIN
    SELECT 
        FUNDRAISER_ID, ORGANIZER, CAPTION, DESCRIPTION, TARGET_FUNDING, CURRENT_FUNDING, CITY, CATEGORY.NAME AS CATEGORY_NAME
    FROM FUNDRAISER
    JOIN CATEGORY ON FUNDRAISER.CATEGORY_ID = CATEGORY.CATEGORY_ID
    WHERE (CITY = city OR city IS NULL) AND (CATEGORY_ID = category_id OR category_id IS NULL) AND ACTIVE = TRUE;
END //
DELIMITER ;

-- Update Fundraiser Current Funding
DELIMITER //
CREATE PROCEDURE update_funding(IN fundraiser_id INT, IN new_amount DECIMAL(10, 2))
BEGIN
    UPDATE FUNDRAISER
    SET CURRENT_FUNDING = CURRENT_FUNDING + new_amount
    WHERE FUNDRAISER_ID = fundraiser_id;
END //
DELIMITER ;
-- View to Show Fundraisers Progress
CREATE VIEW view_fundraiser_progress AS
SELECT 
    FUNDRAISER_ID, ORGANIZER, CAPTION, TARGET_FUNDING, CURRENT_FUNDING,
    (CURRENT_FUNDING / TARGET_FUNDING) * 100 AS progress_percentage
FROM FUNDRAISER;

