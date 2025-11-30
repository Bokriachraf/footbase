"use client";

import { useDispatch, useSelector } from "react-redux";
import { markNotificationRead } from "@/redux/actions/notificationActions";

export default function NotificationsPage() {
  const dispatch = useDispatch();
const { list: notifications } = useSelector((state) => state.notifications || {});

  const handleRead = (id) => {
    dispatch(markNotificationRead(id));
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Notifications</h1>

      {notifications.length === 0 ? (
        <p className="text-gray-500">Aucune notification.</p>
      ) : (
        <ul className="space-y-4">
          {notifications.map((notif) => (
            <li
              key={notif._id}
              className={`p-4 rounded border ${
                notif.read ? "bg-gray-100" : "bg-white border-blue-500"
              }`}
            >
              <div className="flex justify-between items-center">
                <p>{notif.message}</p>
                {!notif.read && (
                  <button
                    onClick={() => handleRead(notif._id)}
                    className="text-sm bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    Marquer comme lue
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
