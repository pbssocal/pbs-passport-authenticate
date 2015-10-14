# PBS Passport Authenticate

PBS Passport Authenticate is a WordPress plugin to enable user logins with PBS Passport 


## Contents

PBS Passport Authenticate includes the following files:

* pbs-passport-authenticate.php, which invokes the plugin and provides the basic required functions.
* A subdirectory named `classes` containing the core PHP class files that most functions depend on.
* A subdirectory named `assets` containing JavaScript, CSS, and image files.

## Installation

1. Copy the `pbs-passport-authenticate` directory into your `wp-content/plugins` directory
2. Navigate to the *Plugins* dashboard page
3. Locate the menu item that reads *PBS Passport Authenticate*
4. Click on *Activate*
5. Navigate to *Settings* and select *PBS Passport Authenticate Settings* 
6. Enter values for all fields

## Usage

The plugin provides two functions:

1. A [pbs-passport-authenticate] shortcode that provides a login/logout link for the user, including going through the PBS Passport 'activation' process
2. A simple AJAX function to determine the login status of the user.



### Shortcode

Drop the shortcode [pbs-passport-authenticate] into place where you would want a login link to appear.  The link can be styled.  

Clicking on the link launches a Colorbox overlay with a Facebook/Google/PBS chooser, options for entering an activation code or becoming a member, and a remember me checkbox.  

Clicking the activation code selector presents a box to enter the activation code.  Doing so, a validity check will be performed, and if successful the MVault info is returned and the Facebook/Google/PBS chooser is presented again.

The chooser links open in the same window (not an overlay), send the user through the authentication process, redirect the user to /pbsoauth/callback/, which then completes the oAuth2 authentication process.

If the user skipped the activation code selector but the logged-in user has no Membership Vault account associated with his or her login, they're presented with the 'enter your activation code' prompt.  Entering the activation code performs a validity check, and then the login is connected to the MVault account.  

In any of these cases, the logged-in user is at the end redirected to the page they started on.

The login link will then be replaced with basic Welcome (name) text and a logout link.

#### Shortcode Arguments

The shortcode takes the following arguments

* `login_text` -- replaces the default login link text



On activation, the plugin registers a hidden custom post type called 'pbsoauth' and creates some posts there with specific slugs:

* `authenticate`, which is an endpoint for our jQuery files to interact with during the authentication process
* `callback`, which will accept any callbacks from the PBS LAAS oAuth2 flow and forward the grant token to the appropriate script




## Changelog

0.1 2015-09-11 Initial base code


## License

The PBS Passport Authenticate plugin is licensed under the GPL v2 or later.

> This program is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License, version 2, as
published by the Free Software Foundation.

> This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

> You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
