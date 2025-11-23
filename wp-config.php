<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the installation.
 * You don't have to use the website, you can copy this file to "wp-config.php"
 * and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * Database settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://developer.wordpress.org/advanced-administration/wordpress/wp-config/
 *
 * @package WordPress
 */

// ** Database settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'webaiconiq' );

/** Database username */
define( 'DB_USER', 'webaiconiq' );

/** Database password */
define( 'DB_PASSWORD', 'AIzaSyDR4NTSJ6Duo4jobR8kkt2hi5TNyaOvLdc' );

/** Database hostname */
define( 'DB_HOST', 'localhost' );

/** Database charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8mb4' );

/** The database collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/**#@+
 * Authentication unique keys and salts.
 *
 * Change these to different unique phrases! You can generate these using
 * the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}.
 *
 * You can change these at any point in time to invalidate all existing cookies.
 * This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',         ')6*DA%3UO:~BW&nxx%,Z2B0i%*Yy^Ts-dNTb=P!>G0yz!/.~o?61uXF9+:_)5NS+' );
define( 'SECURE_AUTH_KEY',  'Z.[2CiD?>DjjY|,27E7y6!C+=(o=9~Rg9IveGEOT]X/OtGGQ6MR[+B:ZK>GMwJ0S' );
define( 'LOGGED_IN_KEY',    'N~.n(n#NUf>`>3vGFW=hDK8&i7,Zg5P@3)6.9JO{<BE1M$!3n7LXFC!*EP* NG]f' );
define( 'NONCE_KEY',        '=MQ~qnV=n7C#U`Ad:zdY^Hh:=RXBP2`6o- IVjaz~]R(A^L5&#-!JF<r*/7qW__]' );
define( 'AUTH_SALT',        'Z78SlwlHu$ |4G4)vy]kW-<kTMEVZZC%ohJ;wGhwL,4(bT)o53{`ZVl(anNkJbU+' );
define( 'SECURE_AUTH_SALT', 'J]q1;9/gp&b3{H-+ysd3tDo5$V?s!=!;{a;hos*eL..MbwQr/WHwKexOtV@O(=0B' );
define( 'LOGGED_IN_SALT',   '<S jyomxRlnPX%r+0Jk?]!GgRAC<hT JENGHO*Z@a+(L$flJogz8n<Hg%l q`,&9' );
define( 'NONCE_SALT',       'iEA[e<I!b|CHm[)f-2QzGdv ^dB@}ur[#iA%+tPPGErpqx@Ix=Sy8QqD%<O|/e;9' );

/**#@-*/

/**
 * WordPress database table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 *
 * At the installation time, database tables are created with the specified prefix.
 * Changing this value after WordPress is installed will make your site think
 * it has not been installed.
 *
 * @link https://developer.wordpress.org/advanced-administration/wordpress/wp-config/#table-prefix
 */
$table_prefix = 'wp_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the documentation.
 *
 * @link https://developer.wordpress.org/advanced-administration/debug/debug-wordpress/
 */
define( 'WP_DEBUG', false );

/* Add any custom values between this line and the "stop editing" line. */



/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
