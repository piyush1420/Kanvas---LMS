#!/bin/bash
# Usage: scripts/security-check.sh <site-url> [admin-password]
#   e.g. scripts/security-check.sh http://localhost:3000
# Checks the access rules and demo-account restrictions through the API.
# Leaves the data as it found it (with an admin password it also deletes
# the throwaway sign-up account it creates).
F="${1%/}"; ADMIN_PW="$2"
[ -z "$F" ] && { echo "usage: $0 <site-url> [admin-password]"; exit 2; }
T=$(mktemp -d); pass=0; fail=0
SIGNUP_JSON=$(printf '{"username":"sec_test_%s","password":"pw-123456","role":"ADMIN"}' "$(date +%s)$RANDOM")
check() { # name expected actual
  if [ "$2" = "$3" ]; then echo "PASS  $1"; pass=$((pass+1)); else echo "FAIL  $1 (expected $2, got $3)"; fail=$((fail+1)); fi
}
req() { # jar method path [json] -> prints HTTP status, body to $T/body
  curl -s -o $T/body -w "%{http_code}" -b "$T/$1" -c "$T/$1" -X "$2" -H 'Content-Type: application/json' ${4:+-d "$4"} "$F$3"
}
contains() { grep -q "$1" $T/body && echo yes || echo no; }

check "anonymous: list users blocked"                401 "$(req anon GET /api/users)"
check "anonymous: delete course blocked"             401 "$(req anon DELETE /api/courses/RS101)"
check "anonymous: edit a user blocked"               401 "$(req anon PUT /api/users/demo-faculty '{"role":"ADMIN"}')"
check "roster login iron_man/stark123 rejected"      401 "$(req anon POST /api/users/signin '{"username":"iron_man","password":"stark123"}')"
check "roster login ada/123 (admin) rejected"        401 "$(req anon POST /api/users/signin '{"username":"ada","password":"123"}')"
check "password-bypass trick rejected"               401 "$(req anon POST /api/users/signin '{"username":"demo_faculty","password":{"$ne":""}}')"

check "demo_student signs in"                        200 "$(req stu POST /api/users/signin '{"username":"demo_student","password":"KanvasDemo1"}')"
check "  sign-in reply has no password"              no  "$(contains password)"
check "  sees quizzes in RS101"                      200 "$(req stu GET /api/courses/RS101/quizzes)"
check "  can't delete a course"                      403 "$(req stu DELETE /api/courses/RS101)"
check "  can't add a module"                         403 "$(req stu POST /api/courses/RS101/modules '{"name":"x"}')"
check "  can't edit another user"                    403 "$(req stu PUT /api/users/demo-faculty '{"firstName":"x"}')"
check "  can't list all users"                       403 "$(req stu GET /api/users)"
check "  can't enroll someone else"                  403 "$(req stu POST /api/users/demo-faculty/courses/RS104)"
check "  can enroll self in RS103"                   200 "$(req stu POST /api/users/demo-student/courses/RS103)"
check "  can drop RS103 again"                       200 "$(req stu DELETE /api/users/demo-student/courses/RS103)"
req stu PUT /api/users/demo-student '{"_id":"demo-student","firstName":"Renamed","password":"hacked","role":"ADMIN","username":"taken"}' >/dev/null
check "  profile edit: name changes"                 200 "$(req stu POST /api/users/profile)"
check "  profile edit: first name saved"             yes "$(contains '"firstName":"Renamed"')"
check "  profile edit: role still STUDENT"           yes "$(contains '"role":"STUDENT"')"
check "  profile edit: password NOT changed"         200 "$(req stu2 POST /api/users/signin '{"username":"demo_student","password":"KanvasDemo1"}')"
req stu PUT /api/users/demo-student '{"_id":"demo-student","firstName":"Demo"}' >/dev/null

check "demo_faculty signs in"                        200 "$(req fac POST /api/users/signin '{"username":"demo_faculty","password":"KanvasDemo1"}')"
check "  can add an assignment"                      200 "$(req fac POST /api/courses/RS101/assignments '{"_id":"SEC-TEST","title":"Security test"}')"
check "  can delete that assignment"                 200 "$(req fac DELETE /api/assignments/SEC-TEST)"
check "  can't make self ADMIN"                      200 "$(req fac PUT /api/users/demo-faculty '{"role":"ADMIN"}')"
req fac POST /api/users/profile >/dev/null
check "  ...role is still FACULTY"                   yes "$(contains '"role":"FACULTY"')"

check "signup asking for ADMIN"                      200 "$(req new POST /api/users/signup "$SIGNUP_JSON")"
check "  ...was created as STUDENT"                  yes "$(contains '"role":"STUDENT"')"

if [ -n "$ADMIN_PW" ]; then
  ADMIN_JSON=$(printf '{"username":"admin","password":"%s"}' "$ADMIN_PW")
  check "private admin signs in"                     200 "$(req adm POST /api/users/signin "$ADMIN_JSON")"
  check "  can list users"                           200 "$(req adm GET /api/users)"
  check "  user list has no passwords"               no  "$(contains password)"
  check "  can't delete a demo account"              403 "$(req adm DELETE /api/users/demo-student)"
  NEWID=$(req new POST /api/users/profile >/dev/null; grep -o '"_id":"[^"]*"' $T/body | head -1 | cut -d'"' -f4)
  check "  can delete the test signup"               200 "$(req adm DELETE /api/users/$NEWID)"
fi
echo "---- $pass passed, $fail failed"
rm -rf $T
[ "$fail" -eq 0 ]
